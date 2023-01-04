export interface File {
  title: string;
  contents: string;
}

export interface Sample {
  ID: string;
  title: string;
  files: File[];
  description: string;
  namespace: string;
  control_ID: string;
}

export interface Control {
  ID: string;
  title: string;
  samples: Sample[];
}
