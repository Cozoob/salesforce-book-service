/**
 * Created by mkozub on 22.07.2022.
 */

public with sharing class BookSearcherController {

    @AuraEnabled(Cacheable=true)
    public static List<AggregateResult> getOrdersByBookId(Id bookId, Id accountId){

        List<OrderItem> orderItems = [
                SELECT Id, OrderId
                FROM OrderItem
                WHERE Product2Id = :bookId
        ];

        Set<Id> orders = new Set<Id>();

        for(OrderItem orderItem : orderItems){
            orders.add(orderItem.OrderId);
        }

        // TODO counting is wrong...
        return [
                SELECT Id, Name, EffectiveDate, Status, COUNT(AccountId) res
                FROM Order
                WHERE Id IN :orders AND AccountId = :accountId
                GROUP BY Id, Name, EffectiveDate, Status
        ];
    }

}