package html.app.mypage;

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

import app.common.CodeInfo;
import app.eCmm.Cmm1100;

import html.app.common.ParsingCommon;

@WebServlet("/webPage/mypage/AbsenceRegister")
public class AbsenceRegister extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	CodeInfo codeinfo = new CodeInfo();
	Cmm1100 cmm1100 = new Cmm1100();
	
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
				case "CodeInfo" :
					response.getWriter().write( getCodeInfo(jsonElement) );
					break;
				case "getUserInfo":
					response.getWriter().write( getUserInfo(jsonElement) );
					break;
				case "getAbsenceInfo":
					response.getWriter().write( getAbsenceInfo(jsonElement) );
					break;
				case "getAbsenceList":
					response.getWriter().write( getAbsenceList(jsonElement) );
					break;
				case "getAbsenceState":
					response.getWriter().write( getAbsenceState(jsonElement) );
					break;
				case "insertAbs":
					response.getWriter().write( insertAbs(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			requestType = null;
		}
		
	}
	
	private String getCodeInfo(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(codeinfo.getCodeInfo("DAEGYUL","sel","n"));
	}
	
	private String getUserInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String Sv_Admin = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "Sv_Admin") );
		return gson.toJson(cmm1100.getCbo_User(UserId,Sv_Admin));
	}
	
	private String getAbsenceInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String cm_manid = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "cm_manid") );
		return gson.toJson(cmm1100.getCbo_User_Click(UserId, cm_manid));
	}
	
	private String getAbsenceList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm1100.getDaegyulList(UserId));
	}
	
	private String getAbsenceState(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm1100.getDaegyulState(UserId));
	}
	
	private String insertAbs(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm1100.get_Update(dataObj));
	}
	
}
