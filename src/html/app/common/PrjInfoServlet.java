package html.app.common;

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

import app.common.PrjInfo;

import html.app.common.ParsingCommon;

@WebServlet("/webPage/common/PrjInfoServlet")
public class PrjInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	PrjInfo prjInfo  = new PrjInfo();
	
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
				case "PROJECT_LIST" :
					response.getWriter().write( getPrjList(jsonElement) );
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

	private String getPrjList(JsonElement jsonElement) throws SQLException, Exception {

		HashMap<String, String> prjMap = new HashMap<String, String>();
		prjMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"prjInfo"));
		
		return gson.toJson(prjInfo.getPrjList(prjMap));
	}
	
}
