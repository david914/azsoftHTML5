package html.app.winpop;

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

import app.common.SystemPath;
import app.eCmr.Cmr5200;
import app.eCmr.Cmr5300;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/winpop/SourceDiffServlet")
public class SourceDiffServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SystemPath systempath = new SystemPath();
	Cmr5200 cmr5200 = new Cmr5200();
	Cmr5300 cmr5300 = new Cmr5300();
	
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
				case "GETECAMSDIR" :
					response.getWriter().write( getTmpDir(jsonElement) );
					break;
				case "GETPROGHISTORY" :
					response.getWriter().write( getProgHistory(jsonElement) );
					break;
				case "GETDIFFLIST" :
					response.getWriter().write( getDiffSrc(jsonElement) );
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
	private String getTmpDir(JsonElement jsonElement) throws SQLException, Exception {
		String pCode = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pCode") );
		return gson.toJson(systempath.geteCAMSDir(pCode));
	}
	private String getProgHistory(JsonElement jsonElement) throws SQLException, Exception {
		String itemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "itemId") );
		return gson.toJson(cmr5300.getFileVer(itemId));
	}
	private String getDiffSrc(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmr5200.getDiffAry(DataMap));
	}
}
