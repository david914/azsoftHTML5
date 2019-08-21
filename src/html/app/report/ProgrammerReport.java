package html.app.report;

import java.io.IOException;
import java.sql.SQLException;
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

import app.common.CodeInfo;
import app.common.TeamInfo;
import app.eCmp.Cmp6100;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/ProgrammerReport")
public class ProgrammerReport extends HttpServlet {

	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	CodeInfo codeinfo = new CodeInfo();
	TeamInfo teaminfo = new TeamInfo();
	Cmp6100 cmp6100 = new Cmp6100();
	
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
				case "getTeamInfo" :
					response.getWriter().write( getTeamInfo() );
					break;
				case "getCodeInfo" :
					response.getWriter().write( getCodeInfo() );
					break;
				case "getRowList" :
					response.getWriter().write( getRowList(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getTeamInfo() throws SQLException, Exception {
		return gson.toJson(teaminfo.getTeamInfoGrid2("ALL", "Y", "DEPT", "N"));
	}
	
	private String getCodeInfo() throws SQLException, Exception {
		return gson.toJson(codeinfo.getCodeInfo("DEVRATE","ALL","N"));
	}
	
	private String getRowList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> map = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "inputData"));
		return gson.toJson(cmp6100.getRowList(map.get("date"), map.get("dept"), map.get("rate"), map.get("devId")));
	}
}
