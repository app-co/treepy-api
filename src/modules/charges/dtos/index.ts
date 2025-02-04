export interface IResponseCard {
  id: string;
  reference_id: string;
  created_at: string;
  customer: {
    name: string;
    email: string;
    tax_id: string;
    phones: {
      type: string;
      country: string;
      area: string;
      number: string;
    }[];
  };

  items: {
    reference_id: string;
    name: string;
    quantity: string;
    unit_amount: string;
  }[];

  shipping: {
    address: {
      street: string;
      number: string;
      complement: string;
      locality: string;
      city: string;
      region_code: string;
      country: string;
      postal_code: string;
    };
  };

  charges: {
    id: string;
    reference_id: string;
    status: string;
    created_at: string;
    paid_at: string;
    description: string;

    amount: {
      value: number;
      currency: string;

      summary: {
        total: number;
        paid: number;
        refunded: string;
      };
    };

    payment_response: {
      code: string;
      message: string;
      reference: string;
    };

    payment_method: {
      type: string;
      installments: string;
      capture: string;

      card: {
        id: string;
        brand: string;
        first_digits: string;
        last_digits: string;
        exp_month: string;
        exp_year: string;

        holder: {
          name: string;
        };
        store: string;
      };

      soft_descriptor: string;
    };

    links: {
      rel: string;
      href: string;
      media: string;
      type: string;
    }[];
  }[];

  notification_urls: [];
  links: {
    rel: string;
    href: string;
    media: string;
    type: string;
  }[];
}

export interface ICharge {
  charge_id: string;
  order_id: string;
  customer: {
    name: string;
    email: string;
    tax_id: string;
    phones: {
      type: string;
      country: string;
      area: string;
      number: string;
    }[];
  };
  fk_user_id: string;
  type: string;
  status: string;
  value: number;
}

export interface IChargeUpdate {
  id: string;
  charge_id?: string;
  order_id?: string;
}

export interface IResponsePix {
  id: string;
  reference_id: string;
  created_at: string;
  customer: {
    name: string;
    email: string;
    tax_id: string;
    phones: [
      {
        type: string;
        country: string;
        area: string;
        number: string;
      },
    ];
  };
  items: [
    {
      name: string;
      quantity: number;
      unit_amount: number;
    },
  ];
  shipping: {
    address: {
      street: string;
      number: string;
      complement: string;
      locality: string;
      city: string;
      region_code: string;
      country: string;
      postal_code: string;
    };
  };
  qr_codes: [
    {
      id: string;
      expiration_date: string;
      amount: {
        value: number;
      };
      text: string;
      arrangements: string[];
      links: [
        {
          rel: string;
          href: string;
          media: string;
          type: string;
        },
        {
          rel: string;
          href: string;
          media: string;
          type: string;
        },
      ];
    },
  ];
  notification_urls: string[];
  links: [
    {
      rel: string;
      href: string;
      media: string;
      type: string;
    },
    {
      rel: string;
      href: string;
      media: string;
      type: string;
    },
  ];
}
