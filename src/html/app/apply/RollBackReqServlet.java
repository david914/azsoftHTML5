package html.app.apply;

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

import app.common.SysInfo;
import app.eCmr.Cmr0600;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/apply/RollBackReqServlet")
public class RollBackReqServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysInfo  = new SysInfo();
	Cmr0600 cmr0600  = new Cmr0600();
	
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
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getBefList" :
					response.getWriter().write( getBefList(jsonElement) );
					break;
				case "getBefReq_Prog" :
					response.getWriter().write( getBefReq_Prog(jsonElement) );
					break;
				case "getDownFileList" :
					response.getWriter().write( getDownFileList(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}

	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String ReqCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCd") );
		String SecuYn = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String CloseYn = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CloseYn") );
		
		return gson.toJson(sysInfo.getSysInfo(UserId,SecuYn,SelMsg,CloseYn,ReqCd));
	}

	private String getBefList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String QryCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "QryCd") );
		String stDate = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "stDate") );
		String edDate = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "edDate") );
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		
		return gson.toJson(cmr0600.getBefList(UserId,QryCd,stDate,edDate,SysCd));
	}

	private String getBefReq_Prog(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		
		return gson.toJson(cmr0600.getBefReq_Prog(UserId,AcptNo));
	}

	private String getDownFileList(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> gridData = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "gridData") );
		HashMap<String, String>	param = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "param") );
		
		return gson.toJson(cmr0600.getDownFileList(gridData,param));
	}
}
