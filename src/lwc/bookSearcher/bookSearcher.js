/**
 * Created by mkozub on 22.07.2022.
 */

import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


import getOrdersByBookId from '@salesforce/apex/BookSearcherController.getOrdersByBookId';
import ORDER_OBJECT from '@salesforce/schema/Order';

const PRODUCT_API_NAME = 'Product2';


const actions = [
    {label: 'Navigate'}
];

const columns = [
    {
        label: 'Id',
        fieldName: 'Id',
        type: 'String'
    },
    {
        label: 'Order name',
        fieldName: 'Name',
        type: 'String'
    },
    {
        label: 'Order Start Date',
        fieldName: 'EffectiveDate',
        type: 'Datetime',
        sortable: true
    },
    {
        label: 'Order status',
        fieldName: 'Status',
        type: 'String'
    },
    {
        label: 'Quantity',
        fieldName: 'res',
        type: 'String'
    },
    {
        label: 'Navigate',
        type: 'action',
        typeAttributes: {
            rowActions: actions
        }
    },
];

export default class BookSearcher extends NavigationMixin(LightningElement) {
    // List of orders of given name of the book
    @track selectedBook;
    @track columns = columns;
    @track sortBy = 'EffectiveDate';
    @track sortDirection='asc';

    @api recordId;
    isDatatableShown = false;
    orders;

    productApiName = PRODUCT_API_NAME;

//    @wire(getOrdersByBookId, {bookId: '$selectedBook.Id', accountId: '$recordId'}) orders;

    handleOnRowAction(event){
        const action = event.detail.action;
        const rowId = event.detail.row.Id;
        this.navigateToOrder(rowId);
    }


    navigateToOrder(Id){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: Id,
                objectApiName: ORDER_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }

    handleSelectedBook(event){
        this.selectedBook = event.detail;
        this.showListOfOrders();
    }

    showListOfOrders(){
        if(this.selectedBook == null){
            this.isDatatableShown = false;
            return;
        }
        this.isDatatableShown = true;

        getOrdersByBookId({bookId: this.selectedBook.Id, accountId: this.recordId}).then((data) => {

            this.orders = data;
        }).catch((error) => {
                      console.error(error);
                      this.dispatchEvent(
                          new ShowToastEvent({
                              title: 'Error loading records',
                              message: error.body.message,
                              variant: 'error',
                          }),
                      );
                  });
    }

    updateColumnSorting(event){
        let fieldName = event.detail.fieldName;
        let sortDirection = event.detail.sortDirection;
//        let sortDirection = event.detail.sortDirection;
        //assign the values
        this.sortDirection = sortDirection;
        //call the custom sort method.
        this.sortData(this.sortBy, sortDirection);
    }

    sortData(fieldName, sortDirection) {
        let sortResult = Object.assign([], this.orders);
        this.orders = sortResult.sort(function(a,b){
          if(a[fieldName] < b[fieldName]){
              if(sortDirection === 'asc'){
                  return -1;
              }
              return 1;
          }
//            return sortDirection === 'asc' ? -1 : 1; ... won't work 'unexpected symbol -' ...
          else if(a[fieldName] > b[fieldName]){
              if(sortDirection === 'asc'){
                    return 1;
                }
                return -1;
          }
//            return sortDirection === 'asc' ? 1 : -1;
          else
            return 0;
        })
      }
}