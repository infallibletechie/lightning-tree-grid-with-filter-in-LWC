public class AccountListController {

    @AuraEnabled(cacheable=true)
    public static List < Account > fetchAccounts() {
        return [ SELECT Id, Name, Industry, Active__c, 
                ( SELECT Id, FirstName, LastName FROM Contacts ) 
                FROM Account LIMIT 100 ];
    }
    

}