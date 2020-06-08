import { LightningElement, track, wire } from 'lwc';
import fetchAccounts from '@salesforce/apex/AccountListController.fetchAccounts';

export default class Example extends LightningElement {

    @track gridColumns = [{
        type: 'text',
        fieldName: 'Name',
        label: 'Name'
    },
    {
        type: 'text',
        fieldName: 'Industry',
        label: 'Industry'
    },
    {
        type: 'text',
        fieldName: 'Active__c',
        label: 'Active',
        actions: [
            { label: 'All', checked: true, name: 'All' },
            { label: 'Yes', checked: false, name: 'Yes' },
            { label: 'No', checked: false, name: 'No' }
        ]
    },
    {
        type: 'text',
        fieldName: 'FirstName',
        label: 'FirstName'
    },
    {
        type: 'text',
        fieldName: 'LastName',
        label: 'LastName'
    }];
    @track gridData;
    @track activeFilter = 'All';
    @track allRows;

    @wire(fetchAccounts)
    accountTreeData({ error, data }) {

        if ( data ) {

            var tempData = JSON.parse( JSON.stringify( data ) );
            /*var tempjson = JSON.parse( JSON.stringify( data ).split( 'Contacts' ).join( '_children' ) );
            console.log( 'Temp JSON is ' + tempjson );*/
            for ( var i = 0; i < tempData.length; i++ ) {

                var cons = tempData[ i ][ 'Contacts' ];

                if ( cons ) {

                    tempData[ i ]._children = cons;
                    delete tempData[ i ].Contacts;

                }

            }
            this.gridData = tempData;
            this.allRows = tempData;

        } else if ( error ) {
          
            if ( Array.isArray( error.body ) )
                console.log( 'Error is ' + error.body.map( e => e.message ).join( ', ' ) );
            else if ( typeof error.body.message === 'string' )
                console.log( 'Error is ' + error.body.message );

        }

    }

    handleHeaderAction( event ) {

        const actionName = event.detail.action.name;
        let columns = this.gridColumns;
        const activeFilter = this.activeFilter;
    
        if ( actionName !== activeFilter ) {

            var actions = columns[ 2 ].actions;
            actions.forEach((action) => {
                action.checked = action.name === actionName;
            });
            columns[ 2 ].actions = actions;
            this.activeFilter = actionName;
            this.gridColumns = columns;
            this.updateRows();

        }

    }

    updateRows() {

        const rows = this.allRows;
        let filteredRows = rows;
        const activeFilter = this.activeFilter;

        if (activeFilter !== 'All') {
            filteredRows = rows.filter(function (row) {
                return ( activeFilter === row.Active__c );
            });
        }

        this.gridData = filteredRows;    

    }

}