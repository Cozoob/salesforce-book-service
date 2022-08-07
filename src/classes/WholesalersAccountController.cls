/**
 * Created by mkozub on 22.07.2022.
 */

public with sharing class WholesalersAccountController {

    @AuraEnabled
    public static List<Account> getWholesalersAccountsByProductId(String productId){
        RecordType RECORD_TYPE_WHOLESALER = [SELECT Id
                                        FROM RecordType
                                        WHERE SobjectType = 'Account' AND DeveloperName = 'Book_Wholesaler'
                                        LIMIT 1];

        List<OrderItem> orderItems = [
                SELECT Id, Order.AccountId
                FROM OrderItem
                WHERE Product2Id = :productId
        ];

        Set<Id> accountsIds = new Set<Id>();

        for(OrderItem orderItem : orderItems){
            accountsIds.add(orderItem.Order.AccountId);
        }

        return [SELECT ShippingAddress, Name
                FROM Account
                WHERE RecordTypeId = :RECORD_TYPE_WHOLESALER.Id AND Id IN :accountsIds
        ];
    }
}