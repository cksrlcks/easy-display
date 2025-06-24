import os from "os";
import path from "path";

export const MEDIA_FOLDER = path.join(os.homedir(), "Documents", "easy-display", "media");

export const MESSAGE = {
  YES: "예",
  NO: "아니오",
  CANCEL: "취소",
  OK: "확인",
  QUITE: "종료",
  CONFIR_QUIT_TITLE: "종료 확인",
  CONFIRM_QUIT: "프로그램을 종료하시겠습니까?",
  FAIL_TO_READ_MEDIA_FOLDER: "미디어 폴더를 읽어오는 데 실패했습니다.",
  FAILT_TO_OPEN_MEDIA_FOLDER: "미디어 폴더를 여는 데 실패했습니다.",
  FAIL_TO_SELECT_FILES: "파일 선택에 실패했습니다.",
  FAIL_TO_COPY_FILES: "파일 복사에 실패했습니다.",
  FAIL_TO_OPEN_MEDIA_FILE: "미디어 파일을 여는 데 실패했습니다.",
  FAIL_TO_FIND_MEDIA_FILE: "미디어 파일을 찾을 수 없습니다.",
  FAIL_TO_DELETE_FILE: "파일 삭제에 실패했습니다.",
  SUCCESS_TO_DELETE_FILE: "파일이 성공적으로 삭제되었습니다.",
  FAIL_TO_GET_LOCAL_IP: "로컬 IP 주소를 가져오는 데 실패했습니다.",
  FAIL_TO_GET_SCREEN_LIST: "화면 목록을 가져오는 데 실패했습니다.",
  SUCCESS_TO_CREATE_SCREEN_: "화면이 성공적으로 생성되었습니다.",
  SCREEN_ALIAS_ALREADY_EXISTS: "이미 존재하는 화면 이름입니다.",
  FAIL_TO_CREATE_SCREEN: "화면 생성에 실패했습니다.",
  SUCCESS_TO_UPDATE_SCREEN: "화면이 성공적으로 업데이트되었습니다.",
  FAIL_TO_UPDATE_SCREEN: "화면 업데이트에 실패했습니다.",
  SUCCESS_TO_DELETE_SCREEN: "화면이 성공적으로 삭제되었습니다.",
  FAIL_TO_DELETE_SCREEN: "화면 삭제에 실패했습니다.",
  FAIL_TO_FIND_SCREEN: "화면을 찾을 수 없습니다.",
  FAIL_TO_GET_SCREEN_BY_ID: "화면 정보를 가져오는 데 실패했습니다.",
  SUCCESS_TO_UPDATE_SCREEN_SLIDES: "슬라이드가 성공적으로 업데이트되었습니다.",
  FAIL_TO_UPDATE_SCREEN_SLIDES: "슬라이드 업데이트에 실패했습니다.",
};
