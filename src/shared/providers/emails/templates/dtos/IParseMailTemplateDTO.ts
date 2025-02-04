interface ITemplateVariables {
  [key: string]: string | number | undefined;
}

export interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
