namespace sap.capire.ui5ninja;

entity Controls {
  key ID      : String(128);
      title   : String(128);
      since   : String(5);
      samples : Association to many Samples
                  on samples.control = $self;
}

entity Samples {
  key ID          : String(128);
      title       : String(128);
      description : String(256);
      control     : Association to Controls;
}
