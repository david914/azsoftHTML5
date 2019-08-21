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
import app.eCmr.Cmr0200;
import app.eCmr.Cmr0600;
import app.eCmr.Confirm_select;
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
	Cmr0200 cmr0200  = new Cmr0200();
	Confirm_select confirm_select = new Confirm_select();
	
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
				case "confSelect" :
					response.getWriter().write( confSelect(jsonElement) );
					break;
				case "Confirm_Info" :
					response.getWriter().write( Confirm_Info(jsonElement) );
					break;
				case "request_Check_In" :
					response.getWriter().write( request_Check_In(jsonElement) );
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
	
	private String confSelect(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> confirmInfoData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"confirmInfoData"));
		return gson.toJson(cmr0200.confSelect(confirmInfoData.get("SysCd"), 
															   confirmInfoData.get("ReqCd"),
															   confirmInfoData.get("strRsrcCd"),
															   confirmInfoData.get("UserID"),
															   confirmInfoData.get("strQry")));
			
	}
	
	private String Confirm_Info(JsonElement jsonElement) throws SQLException, Exception{
		HashMap<String, String> confirmInfoData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"confirmInfoData"));
		return gson.toJson(confirm_select.Confirm_Info(confirmInfoData));
	}

	private String request_Check_In(JsonElement jsonElement) throws SQLException, Exception {
		
		ArrayList<HashMap<String, String>> reqData = new ArrayList<HashMap<String, String>>();
		reqData = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"reqData"));

		HashMap<String, String> requestData = new HashMap<String, String>();
		requestData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"requestData"));
		
		ArrayList<HashMap<String, Object>> confirmInfoData = new ArrayList<HashMap<String, Object>>();
		confirmInfoData = ParsingCommon.jsonStrToArrObj(ParsingCommon.jsonEtoStr(jsonElement,"confirmInfoData"));
		
		String confFg = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "confFg") );
		
		ArrayList<HashMap<String, String>> scriptList = new ArrayList<HashMap<String, String>>();
		
		return gson.toJson(cmr0600.request_Check_In(reqData, requestData, confirmInfoData, confFg, scriptList));
			
	}
}
