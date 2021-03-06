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

import org.apache.log4j.Logger;

import com.ecams.common.logger.EcamsLogger;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.SystemPath;
import app.eCmr.Cmr5300;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/winpop/RequestSourceViewServlet")
public class RequestSourceViewServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SystemPath systempath = new SystemPath();
	Cmr5300 cmr5300 = new Cmr5300();
	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
	
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
				case "GETREQLIST" :
					response.getWriter().write( getReqList(jsonElement) );
					break;
				case "GETFILETEXT" :
					response.getWriter().write( getFiletext(jsonElement) );
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
	private String getReqList(JsonElement jsonElement) throws SQLException, Exception {
		String userid = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userid") );
		String acptno = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "acptno") );
		return gson.toJson(cmr5300.getReqList(acptno,userid));
	}
	private String getFiletext(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );

		try { 
			return gson.toJson(cmr5300.getFileText(DataMap));
		} catch (SQLException e) {
			e.printStackTrace();
			ecamsLogger.error("## Cmr5300.getFileText() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", e);
			ecamsLogger.error("## Cmr5300.getFileText() SQLException END ##");

			return gson.toJson("ERROR"+e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			ecamsLogger.error("## Cmr5300.getFileText() Exception START ##");
			ecamsLogger.error("## Error DESC : ", e);
			ecamsLogger.error("## Cmr5300.getFileText() Exception END ##");
			
			return gson.toJson("ERROR"+e.getMessage());
		} 
		
	}
}
