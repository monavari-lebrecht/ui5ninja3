using {sap.capire.ui5ninja as my} from '../db/schema';

service CatalogService @(path : '/browses') {

    @readonly
    entity Controls as
        select from my.Controls {
            *
        }
        order by
            title;

    entity Samples  as
        select from my.Samples {
            *
        }
        order by
            title;
}
