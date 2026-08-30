import type { AppId } from "@/components/pretendpro/chrome";
import { DocuFaker } from "@/components/pretendpro/DocuFaker";
import { SheetShenanigans } from "@/components/pretendpro/SheetShenanigans";
import { BrowserBuddy } from "@/components/pretendpro/BrowserBuddy";
import { InboxMirage } from "@/components/pretendpro/InboxMirage";
import { CodeFaker } from "@/components/pretendpro/CodeFaker";
import { DeckDreamer } from "@/components/pretendpro/DeckDreamer";
import { ReaderRealm } from "@/components/pretendpro/ReaderRealm";
import { PhotoPretender } from "@/components/pretendpro/PhotoPretender";
import { ReelPretender } from "@/components/pretendpro/ReelPretender";
import { SoundStage } from "@/components/pretendpro/SoundStage";

/** Every fake app screen, keyed by app id. Shared by desktop and phone editions. */
export const screens: Record<AppId, (props: { animated: boolean }) => React.ReactNode> = {
  docufaker: DocuFaker,
  sheets: SheetShenanigans,
  browser: BrowserBuddy,
  inbox: InboxMirage,
  codeweb: (props) => <CodeFaker mode="web" {...props} />,
  codegame: (props) => <CodeFaker mode="game" {...props} />,
  deck: DeckDreamer,
  reader: ReaderRealm,
  photos: PhotoPretender,
  reels: ReelPretender,
  sound: SoundStage,
};
