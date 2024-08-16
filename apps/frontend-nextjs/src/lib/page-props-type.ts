import { Space, SpaceList, UserInfo } from '@/stores/store-type';

type PageCommonProps = {
  userInfo: UserInfo;
  spaceList: SpaceList;
};

export type SpacePageProps = PageCommonProps & {
  //
};

export type SpaceIdPageProps = PageCommonProps & {
  currSpace: Space;
};

export type DocPageProps = PageCommonProps & {
  currSpace: Space;
};
