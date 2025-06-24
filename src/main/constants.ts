import os from "os";
import path from "path";

export const MEDIA_FOLDER = path.join(os.homedir(), "Documents", "easy-display", "media");

export const MESSAGE = {
  FAIL_TO_READ_MEDIA_FOLDER: "미디어 폴더를 읽어오는 데 실패했습니다.",
  FAILT_TO_OPEN_MEDIA_FOLDER: "미디어 폴더를 여는 데 실패했습니다.",
  FAIL_TO_SELECT_FILES: "파일 선택에 실패했습니다.",
  FAIL_TO_COPY_FILES: "파일 복사에 실패했습니다.",
  FAIL_TO_OPEN_MEDIA_FILE: "미디어 파일을 여는 데 실패했습니다.",
  FAIL_TO_FIND_MEDIA_FILE: "미디어 파일을 찾을 수 없습니다.",
  FAIL_TO_DELETE_FILE: "파일 삭제에 실패했습니다.",
  SUCCESS_TO_DELETE_FILE: "파일이 성공적으로 삭제되었습니다.",

  FAIL_TO_GET_LOCAL_IP: "로컬 IP 주소를 가져오는 데 실패했습니다.",
};
