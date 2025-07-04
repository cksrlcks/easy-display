import os from "os";
import path from "path";

export const MEDIA_FOLDER = path.join(os.homedir(), "Documents", "easy-display", "media");

export const COMMON_MESSAGE = {
  YES: "예",
  NO: "아니오",
  CANCEL: "취소",
  OK: "확인",
  QUITE: "종료",
  CONFIR_QUIT_TITLE: "종료 확인",
  CONFIRM_QUIT: "프로그램을 종료하시겠습니까?",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
  OPEN_MEDIA_FOLDER: "미디어 폴더 열기",
};
