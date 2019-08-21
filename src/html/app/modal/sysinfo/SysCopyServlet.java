package html.app.modal.sysinfo;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.SysInfo;
import app.eCmm.Cmm0200_Copy;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/sysinfo/SysCopyServlet")
public class SysCopyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	Cmm0200_Copy cmm0200_copy = new Cmm0200_Copy();
	
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
				case "getSysCbo" :
					response.getWriter().write(getSysCbo(jsonElement));
					break;
				case "getPrgInfo" :
					response.getWriter().write(getPrgInfo(jsonElement));
					break;
				case "getDetailSvrInfo" :
					response.getWriter().write(getDetailSvrInfo(jsonElement));
					break;
				case "getDirInfo" :
					response.getWriter().write(getDirInfo(jsonElement));
					break;
				case "copySys" :
					response.getWriter().write(copySys(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [시스템정보 > 시스템정보복사]  From system cbo 가져오기
	private String getSysCbo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		return gson.toJson(sysinfo.getSysInfo_Rpt(etcData));
	}
	
	// [시스템정보 > 시스템정보복사]  프로그램종류가져오기
	private String getPrgInfo(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_copy.getProgInfo(SysCd));
	}
	
	// [시스템정보 > 시스템정보복사]  시스템상세가져오기
	private String getDetailSvrInfo(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SvrCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SvrCd") );
		return gson.toJson(cmm0200_copy.getSvrInfo(SysCd, SvrCd));
	}
	
	// [시스템정보 > 시스템정보복사]  공통디렉토리가져오기
	private String getDirInfo(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_copy.getDirInfo(SysCd));
	}
	
	// [시스템정보 > 시스템정보복사] 시스템 복사
	private String copySys(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData 			= ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		ArrayList<HashMap<String, String>> svrList 	= ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "svrList") );
		ArrayList<HashMap<String, String>> dirList 	= ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "dirList") );
		return gson.toJson(cmm0200_copy.sysCopy(etcData, svrList, dirList));
	}
	
	
}
