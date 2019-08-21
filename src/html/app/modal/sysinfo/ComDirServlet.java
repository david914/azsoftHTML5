package html.app.modal.sysinfo;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmm.Cmm0200_Dir;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/sysinfo/ComDirServlet")
public class ComDirServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm0200_Dir cmm0200_dir = new Cmm0200_Dir();
	
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
				case "getDirList" :
					response.getWriter().write(getDirList(jsonElement));
					break;
				case "insertDir" :
					response.getWriter().write(insertDir(jsonElement));
					break;
				case "closeDir" :
					response.getWriter().write(closeDir(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [시스템정보 > 공통디렉토리]  공통디렉토리 리스트 가져오기
	private String getDirList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_dir.getDirList(SysCd));
	}
	
	// [시스템정보 > 공통디렉토리]  공통디렉토리 리스트 가져오기
	private String insertDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "etcData"));
		return gson.toJson(cmm0200_dir.dirInfo_Ins(etcData));
	}
	
	// [시스템정보 > 공통디렉토리]  공통디렉토리 리스트 가져오기
	private String closeDir(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd"));
		String DirCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "DirCd"));
		return gson.toJson(cmm0200_dir.dirInfo_Close(SysCd, DirCd));
	}
	
}
