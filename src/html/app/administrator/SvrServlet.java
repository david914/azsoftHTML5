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

import app.eCmm.Cmm0200_Svr;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/SvrServlet")
public class SvrServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	Gson gson = new Gson();
	Cmm0200_Svr cmm0200_svr = new Cmm0200_Svr();
	
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
				case "getSvrInfoList" :
					response.getWriter().write(getSvrInfoList(jsonElement));
					break;
				case "svrInAnUp" :
					response.getWriter().write(inserAnUpSvr(jsonElement));
					break;
				case "svrCopy" :
					response.getWriter().write(copySvr(jsonElement));
					break;
				case "svrIn" :
					response.getWriter().write(insertSvr(jsonElement));
					break;
				case "closeSvr" :
					response.getWriter().write(closeSvr(jsonElement));
					break;
				
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getSvrInfoList(JsonElement jsonElement) throws SQLException, Exception {
		String sysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "sysCd") );
		String svrInfoStr = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "svrInfoStr") );
		return gson.toJson(cmm0200_svr.getSvrList(sysCd, svrInfoStr));
	}
	
	private String inserAnUpSvr(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> svrReqInfo = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "svrReqInfo") );
		return gson.toJson(cmm0200_svr.svrInfo_Ins_updt(svrReqInfo) );
	}
	
	private String copySvr(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> svrReqInfo = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "svrReqInfo") );
		return gson.toJson(cmm0200_svr.svrInfo_Ins_copy(svrReqInfo) );
	}
	
	private String insertSvr(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> svrReqInfo = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "svrReqInfo") );
		return gson.toJson(cmm0200_svr.svrInfo_Ins(svrReqInfo) );
	}
	
	private String closeSvr(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SvrCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SvrCd") );
		String SeqNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SeqNo") );
		
		return gson.toJson(cmm0200_svr.svrInfo_Close(SysCd,UserId,SvrCd,SeqNo) );
	}
	
}
