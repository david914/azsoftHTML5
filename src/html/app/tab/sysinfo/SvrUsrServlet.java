package html.app.tab.sysinfo;

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
import app.eCmm.Cmm0200_Svr;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/tab/sysinfo/SvrUsrServlet")
public class SvrUsrServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	Gson gson = new Gson();
	Cmm0200_Copy cmm0200_Copy = new Cmm0200_Copy();
	SysInfo sysinfo = new SysInfo();
	Cmm0200_Svr cmm0200_svr = new Cmm0200_Svr();
	
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
				case "getSvrUsrInfo" :
					response.getWriter().write(getSvrUsrInfo(jsonElement));
					break;
				case "getUlSvrInfo" :
					response.getWriter().write(getUlSvrInfo(jsonElement));
					break;
				case "getSecuList" :
					response.getWriter().write(getSecuList(jsonElement));
					break;
				case "insertSecuInfo" :
					response.getWriter().write(insertSecuInfo(jsonElement));
					break;
				case "closeSvrUsr" :
					response.getWriter().write(closeSvrUsr(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [시스템상세정보 > 계정정보] 서버종류 가져오기
	private String getSvrUsrInfo(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SvrCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SvrCd") );
		return gson.toJson(cmm0200_Copy.getSvrInfo(SysCd, SvrCd));
	}
	
	// [시스템상세정보 > 계정정보] 사용업무 가져오기
	private String getUlSvrInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		return gson.toJson(sysinfo.getJobInfo_Rpt(etcData));
	}
	
	// [시스템상세정보 > 계정정보] 계정연결정보 리스트 가져오기
	private String getSecuList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String sysInfo 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "sysInfo") );
		return gson.toJson(cmm0200_svr.getSecuList(SysCd, sysInfo));
	}
	
	// [시스템상세정보 > 계정정보] 계정연결정보 인서트
	private String insertSecuInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		ArrayList<HashMap<String, String>> svrList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "svrList") );
		return gson.toJson(cmm0200_svr.secuInfo_Ins(etcData,svrList));
	}
	
	// [시스템상세정보 > 계정정보] 계정연결정보 삭제
	private String closeSvrUsr(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String JobCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "JobCd") );
		ArrayList<HashMap<String, String>> svrList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "svrList") );
		return gson.toJson(cmm0200_svr.secuInfo_Close(SysCd, JobCd, svrList));
	}
}
