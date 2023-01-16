export {}

declare global {
  const __global: {
    env: {
      isProd: boolean;
      API_URL: string;
      SITE_URL: string;
    }
  };
  interface Taxonomy {
    id: number;
    parent: number;
    name: string;
  };
  interface Reply {
    id: number;
    name: string;
    url: string;
    body: string;
  };
  interface publicQuestion {
    id: number; 
    question_de: string;
    description_de: string;
    participantSynonym: string; 
    created: string;
    relation: string;
    tsne_x: number;
    tsne_y: number;
    liked: boolean;
    state: string;
    has_reply: boolean;
    sentiment_summary: string;
    sonar_all: string;
    profanityfilter: number;
    taxonomies: {
      id: number;
      name: string;
    }[];
    replies: {
      id: number;
      name: string;
    }[];
  };
  interface publicQuestionResult {
    maxPage: number;
    count: number;
    dateRange: [string, string];
    page: number;
    hasSearch: boolean;
    hasTaxonomy: boolean;
    hasDate: boolean;
    hasAnswer: boolean;
    results: publicQuestion[];
  };
}
