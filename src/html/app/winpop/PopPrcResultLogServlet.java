package html.app.winpop;

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

import app.eCmr.Cmr5100;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/winpop/PopPrcResultLogServlet")
public class PopPrcResultLogServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmr5100 cmr5100 = new Cmr5100();
	
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
				case "getResultGbn" :
					response.getWriter().write( getResultGbn(jsonElement) );
					break;
				case "getResultList" :
					response.getWriter().write( getResultList(jsonElement) );
					break;
				case "getFileText" :
					response.getWriter().write( getFileText(jsonElement) );
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

	private String getResultGbn(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		
		return gson.toJson(cmr5100.getResultGbn(AcptNo));
	}

	private String getResultList(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		
		return gson.toJson(cmr5100.getResultList(AcptNo, UserId));
	}
	
	private String getFileText(JsonElement jsonElement) throws SQLException, Exception {
		try { 
			String rstfile = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "rstfile") );
			return gson.toJson(cmr5100.getFileText(rstfile));
		} catch (SQLException e) {
			return gson.toJson("ERROR:"+e.getMessage());
		} catch (Exception e) {
			return gson.toJson("ERROR:"+e.getMessage());
		} 
	}
}