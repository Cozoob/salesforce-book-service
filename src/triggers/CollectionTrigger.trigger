/**
 * Created by mkozub on 22.07.2022.
 */

trigger CollectionTrigger on Collection__c (after insert, after update) {
    if(Trigger.isAfter && Trigger.isInsert){
        CollectionTriggerHandler.handleAfterInsert(Trigger.new);
    } else if(Trigger.isAfter && Trigger.isUpdate){
        CollectionTriggerHandler.handleAfterUpdate(Trigger.new);
    }
}