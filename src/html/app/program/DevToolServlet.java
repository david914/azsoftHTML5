package html.app.program;

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

import app.eCmd.Cmd0101;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/program/DevTool")
public class DevToolServlet extends HttpServlet {
	/**
	 * 
	 */
	Cmd0101 cmd0101  = new Cmd0101();
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	
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
				case "getSysCd" :
					response.getWriter().write(getSysCd(jsonElement));
					break;
				case "getJobCd" :
					response.getWriter().write(getJobCd(jsonElement));
					break;
				case "getPfmList" :
					response.getWriter().write(getPfmList(jsonElement));
					break;
				case "insCmr0020" :
					response.getWriter().write(insCmr0020(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}

	private String getSysCd(JsonElement jsonElement) throws SQLException, Exception {
		String userId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserID") );
		return gson.toJson( cmd0101.getSysCd(userId));
	}
	
	private String getJobCd(JsonElement jsonElement) throws SQLException, Exception {
		String userId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserID") );
		String sysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson( cmd0101.getJobCd(userId, sysCd));
	}
	
	private String getPfmList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 PfmListData = null;
		PfmListData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "PfmListData"));
		return gson.toJson( cmd0101.getPfmList(PfmListData.get("tmpUser"),PfmListData.get("fileName"),PfmListData.get("SysCd"),PfmListData.get("JobCd")));
	}

	private String insCmr0020(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 tmpObj = null;
		tmpObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "tmpObj"));
		ArrayList<HashMap<String, String>> 	 tmpArray = null;
		tmpArray = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "tmpArray"));
		return gson.toJson( cmd0101.insCmr0020(tmpObj, tmpArray));
	}
}
