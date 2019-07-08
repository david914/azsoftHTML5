package html.app.modal.userinfo;

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

import app.eCmm.Cmm0400;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/userinfo/AllUserInfoServlet")
public class AllUserInfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm0400 cmm0400 = new Cmm0400();
	
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
				case "getTeamList" :
					response.getWriter().write( getTeamList(jsonElement) );
					break;
				case "getAllUserInfo" :
					response.getWriter().write( getAllUserInfo(jsonElement) );
					break;
			
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}

	// [사용자정보 > 전체사용자조회] 팀 리스트 가져오기
	private String getTeamList(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0400.getTeamList());
	}
	
	// [사용자정보 > 전체사용자조회] 전체사용자 가져오기
	private String getAllUserInfo(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_Team = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "Cbo_Team") );
		String Option 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "Option") );
		return gson.toJson(cmm0400.getAllUserInfo(Cbo_Team, Integer.parseInt(Option)));
	}
	
}
