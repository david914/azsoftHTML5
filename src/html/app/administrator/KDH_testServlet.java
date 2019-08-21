package html.app.administrator;

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

import app.eCmm.Kdh_test;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/KDH_testServlet")
public class KDH_testServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Kdh_test Kdh_test = new Kdh_test();
	

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		JsonParser jsonParser = new JsonParser();
		JsonElement jsonElement = jsonParser.parse(ParsingCommon.getJsonStr(request));
		String requestType	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "requestType") );
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "GETUSERLIST" :
					response.getWriter().write( getUserList(jsonElement) );
					break;
				case "GETPOSITIONLIST" :
					response.getWriter().write( getPositionList() );
					break;
				case "GETDUTYLIST" :
					response.getWriter().write( getDutyList() );
					break;
				case "GETUSERLISTDUTY" :
					response.getWriter().write( getUserListDuty(jsonElement) );
					break;
				case "GETUSERINFO" :
					response.getWriter().write( getUserInfo(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	private String getUserList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> map = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"info"));
		String result = gson.toJson(Kdh_test.getUserList(
				map.get("name"), 
				map.get("id"), 
				map.get("position"), 
				map.get("duty"), 
				Integer.parseInt(map.get("option")), 
				map.get("stDt"), 
				map.get("edDt")));
		return result;
	}
	
	private String getPositionList() throws SQLException, Exception {
		return gson.toJson(Kdh_test.getPositionList());
	}
	
	private String getDutyList() throws SQLException, Exception {
		return gson.toJson(Kdh_test.getDutyList());
	}
	
	private String getUserListDuty(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> map = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"info"));
		return gson.toJson(Kdh_test.getUserListDuty(map.get("duty")));
	}
	
	private String getUserInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> map = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "info"));
		return gson.toJson(Kdh_test.getUserInfo(map.get("cm_userid")));
	}

}
