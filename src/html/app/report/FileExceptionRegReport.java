package html.app.report;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.SysInfo;
import app.eCmp.Cmp3000;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/FileExceptionRegReport")
public class FileExceptionRegReport extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	Cmp3000 cmp3000 = new Cmp3000();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonParser jsonParser = new JsonParser();
		JsonElement jsonElement = jsonParser.parse(ParsingCommon.getJsonStr(request));
		String requestType	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "requestType") );
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getJobInfo" :
					response.getWriter().write( getJobInfo(jsonElement) );
					break;
				case "getRsrcInfo" :
					response.getWriter().write( getRsrcInfo(jsonElement) );
					break;
				case "getDirInfo" :
					response.getWriter().write( getDirInfo(jsonElement) );
					break;
				case "getResult" :
					response.getWriter().write( getResult(jsonElement) );
					break;
				case "insertData" :
					response.getWriter().write( insertData(jsonElement) );
					break;
				case "delData" :
					response.getWriter().write( delData(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	// [파일대사예외등록현황] 시스템 콤보 정보 가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SecuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SecuYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		String CloseYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"CloseYn"));
		String ReqCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ReqCd"));
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	// [파일대사예외등록현황] 업무 콤보 정보 가져오기
	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserID 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserID"));
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String SecuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SecuYn"));
		String CloseYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"CloseYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		String sortCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sortCd"));
		return gson.toJson(sysinfo.getJobInfo(UserID, SysCd, SecuYn, CloseYn, SelMsg, sortCd));
	}
	// [파일대사예외등록현황] 프로그램종류 콤보 가져오기
	private String getRsrcInfo(JsonElement jsonElement) throws SQLException, Exception {
		String syscd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"syscd"));
		return gson.toJson(cmp3000.get_rsrcInfo(syscd));
	}
	// [파일대사예외등록현황] 디렉토리 정보 가져오기
	private String getDirInfo(JsonElement jsonElement) throws SQLException, Exception {
		String syscd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"syscd"));
		String jobcd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"jobcd"));
		String rsrccd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"rsrccd"));
		String admin 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"admin"));
		String strId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"strId"));
		return gson.toJson(cmp3000.get_dirInfo(syscd, jobcd, rsrccd, admin, strId));
	}
	// [파일대사예외등록현황] 예외등록 리스트 가져오기
	private String getResult(JsonElement jsonElement) throws SQLException, Exception {
		String strSys = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"strSys"));
		return gson.toJson(cmp3000.get_Result(strSys));
	}
	// [파일대사예외등록현황] 예외 등록
	private String insertData(JsonElement jsonElement) throws SQLException, Exception {
		String gubun 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"gubun"));
		String syscd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"syscd"));
		String jobcd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"jobcd"));
		String rsrccd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"rsrccd"));
		String dirpath 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"dirpath"));
		String sayu 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sayu"));
		String pgmname 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"pgmname"));
		String txtsayu 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"txtsayu"));
		String strUserId = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"strUserId"));
		return gson.toJson(cmp3000.InsertData(gubun, syscd, jobcd, rsrccd, dirpath, sayu, pgmname, txtsayu, strUserId));
	}
	// [파일대사예외등록현황] 예외 삭제
	private String delData(JsonElement jsonElement) throws SQLException, Exception {
		String gubun 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"gubun"));
		String syscd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"syscd"));
		String dirpath 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"dirpath"));
		String pgmname 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"pgmname"));
		String txtsayu 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"txtsayu"));
		String strUserId = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"strUserId"));
		return gson.toJson(cmp3000.DelData(gubun, syscd, dirpath, pgmname, strUserId, txtsayu));
	}
}
