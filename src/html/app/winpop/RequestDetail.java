package html.app.winpop;

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

import app.eCmr.Cmr0250;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/winpop/RequestDetail")
public class RequestDetail extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmr0250 cmr0250  = new Cmr0250();
	
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
				case "getReqList" :
					response.getWriter().write( getReqList(jsonElement) );
					break;
				case "getPrcSys" :
					response.getWriter().write( getPrcSys(jsonElement) );
					break;
				case "getProgList" :
					response.getWriter().write( getProgList(jsonElement) );
					break;
				case "getRstList" :
					response.getWriter().write( getRstList(jsonElement) );
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			requestType = null;
		}
		
	}

	private String getReqList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		
		return gson.toJson(cmr0250.getReqList(UserId,AcptNo));
	}

	private String getPrcSys(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		
		return gson.toJson(cmr0250.getPrcSys(AcptNo));
	}

	private String getProgList(JsonElement jsonElement) throws SQLException, Exception {
		
		HashMap<String, String> param = new HashMap<String, String>();
		param = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"param"));
		
		return gson.toJson(cmr0250.getProgList(param.get("UserId"),param.get("AcptNo"),param.get("chkYn"),Boolean.parseBoolean(param.get("qrySw"))));
	}
	
	private String getRstList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String prcSys = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "prcSys") );
		
		return gson.toJson(cmr0250.getRstList(UserId,AcptNo,prcSys));
	}
}
