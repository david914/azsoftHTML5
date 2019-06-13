package html.app.administrator;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ecams.service.list.LoginManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmd.Cmd1200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/BuildReleaseInfo")
public class BuildReleaseInfo extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmd1200 cmd1200 = new Cmd1200();
	
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
				case "getBldCd" :
					response.getWriter().write(getBldCd(jsonElement));
					break;
				case "getScript" :
					response.getWriter().write(getScript(jsonElement));
					break;
				case "insertScript" :
					response.getWriter().write(insertScript(jsonElement));
					break;
				case "copyScript" :
					response.getWriter().write(copyScript(jsonElement));
					break;
				case "delScript" :
					response.getWriter().write(delScript(jsonElement));
					break;
				case "getExistScript" :
					response.getWriter().write(getExistScript(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [빌드/릴리즈정보] 유형구분 cbo 가져오기
	private String getBldCd(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmd1200.getBldCd());
	}
	
	// [빌드/릴리즈정보] 유형구분 선택시 스크립트 가져오기
	private String getScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn_code = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn_code"));
		String Cbo_BldCd0_code = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldCd0_code"));
		return gson.toJson(cmd1200.getScript(Cbo_BldGbn_code, Cbo_BldCd0_code));
	}
	
	// [빌드/릴리즈정보] 스크립트 저장
	private String insertScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn"));
		String Cbo_BldCd0 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldCd0"));
		String Txt_Comp2 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Txt_Comp2"));
		String runType 		= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"runType"));
		ArrayList<HashMap<String, String>> Lv_File0_dp 	= ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"Lv_File0_dp"));
		return gson.toJson(cmd1200.getCmm0022_DBProc(Cbo_BldGbn, Cbo_BldCd0, Txt_Comp2, runType, Lv_File0_dp));
	}
	
	// [빌드/릴리즈정보] 스크립트 새이름저장
	private String copyScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn"));
		String Cbo_BldCd0 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldCd0"));
		String Txt_Comp2 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Txt_Comp2"));
		String NewBld 		= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"NewBld"));
		return gson.toJson(cmd1200.getCmm0022_Copy(Cbo_BldGbn, Cbo_BldCd0, NewBld));
	}
	
	// [빌드/릴리즈정보] 스크립트 유형 삭제
	private String delScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn"));
		String Cbo_BldCd0 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldCd0"));
		return gson.toJson(cmd1200.getCmm0022_Del(Cbo_BldGbn, Cbo_BldCd0));
	}
	
	// [빌드/릴리즈정보] 스크립트 유형 삭제
	private String getExistScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn"));
		String msg 			= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"msg"));
		return gson.toJson(cmd1200.getSql_Qry(Cbo_BldGbn, msg));
	}
}
