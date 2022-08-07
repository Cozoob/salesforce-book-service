/**
 * Created by mkozub on 22.07.2022.
 */

public with sharing class CollectionTriggerHandler {
    public static void handleAfterInsert(List<Collection__c> collections){
        deactivateProductsForWithdrawnCollection(collections);
    }

    public static void handleAfterUpdate(List<Collection__c> collections){
        deactivateProductsForWithdrawnCollection(collections);
    }

    private static void deactivateProductsForWithdrawnCollection(List<Collection__c> collections){
        List<Collection__c> collectionsWithProducts = [SELECT Id, (SELECT Name FROM Products__r), Status__c
                                                        FROM Collection__c
                                                        WHERE Id = :collections];

        Set<Product2> products = new Set<Product2>();
        for(Collection__c collection : collectionsWithProducts){
            if(collection.Status__c == 'Withdrawn') {
                products.addAll(collection.Products__r);
            }
        }

        List<Product2> productsToUpdate = new List<Product2>(products);

        for(Product2 product : productsToUpdate){
            product.IsActive = false;
        }
        update productsToUpdate;
    }
}