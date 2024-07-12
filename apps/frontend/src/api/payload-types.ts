type SignupPayload = {
  email: string;
  password: string;
};

type SigninPayload = SignupPayload;

type PayloadWithId = {
  id: string;
};

type CreateDocumentPayload = {
  name: string;
  spaceId: string;
  doc: {
    store: any;
    schema: any;
  };
};
