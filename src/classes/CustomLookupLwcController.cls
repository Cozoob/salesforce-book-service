/**
 * Created by mkozub on 22.07.2022.
 */

public with sharing class CustomLookupLwcController {
// Method to fetch lookup search result   
    @AuraEnabled(Cacheable=true)
    public static List<SObject> fetchLookupData(String searchKey , String sObjectApiName) {
        List < SObject > returnList = new List < SObject > ();
        String sWildCardText = '%' + searchKey + '%';
        String sQuery = 'Select Id,Name From ' + sObjectApiName + ' Where Name Like : sWildCardText order by createdDate DESC LIMIT 5';
        for (SObject obj: Database.query(sQuery)) {
            returnList.add(obj);
        }
        return returnList;
    }

    // Method to fetch lookup default value
    @AuraEnabled
    public static SObject fetchDefaultRecord(String recordId , String sObjectApiName) {
        String sRecId = recordId;
        String sQuery = 'Select Id,Name From ' + sObjectApiName + ' Where Id = : sRecId LIMIT 1';
        for (SObject obj: Database.query(sQuery)) {
            return obj;
        }
        return null;
    }
}