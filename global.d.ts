declare module "*.css"

type LeadItemFormatted = {
   name: string;
   address: string;
   email: string;
   website: string;
   phoneNumber: string;
}

type ThomsonLocalBusiness = {
   name: string;
   address: string;
   website: string;
   phoneNumber: string;
}

type SmallBusinessFinderItem = {
   address: string;
   distance: string;
   events: {
      item: any[];
   };
   id: string;
   index: string;
   isFavourite: boolean;
   latitude: string;
   longitude: string;
   name: string;
   offers: {
      item: any[];
   };
   resultID: string;
   socialMedia: {
      item: SocialMediaItem[];
   };
   summary: string;
   tags: {
      item: TagItem[];
   };
   thumbURI: string;
   website: string;
   phoneNumber: string;
}

type SocialMediaItem = {
  desc: string;
  iconClass: string;
  subType: number;
  type: number;
  urlPrefix?: string;
  value: string;
}

type TagItem = {
  subType: number;
  type: number;
  value: string;
}