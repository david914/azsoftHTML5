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
import app.eCmd.Cmd0100;
import app.eCmr.Cmr0200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/apply/ApplyRequest")
public class ApplyRequest extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysInfo  = new SysInfo();
	Cmd0100 cmd0100  = new Cmd0100();
	Cmr0200 cmr0200  = new Cmr0200();
	
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
				case "getSysInfoList" :
					response.getWriter().write( getSysInfoList(jsonElement) );
					break;
				case "RSRCOPEN" :
					response.getWriter().write( getRsrcOpen(jsonElement) );
					break;
				case "PROGRAM_LIST" :
					response.getWriter().write( getDeployList(jsonElement) );
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
				case "requestConf" :
					response.getWriter().write( requestConf(jsonElement) );
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

	private String getSysInfoList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = null;
		UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String ReqCd = null;
		ReqCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCd") );
		
		return gson.toJson(sysInfo.getSysInfo(UserId,"Y","SEL","n",ReqCd));
	}
	
	private String getRsrcOpen(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = null;
		SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SelMsg = null;
		SelMsg = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		
		return gson.toJson(cmd0100.getRsrcOpen(SysCd,SelMsg));
	}
	
	private String getDeployList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> prjMap = new HashMap<String, String>();
		prjMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"param"));
		
		if ("07".equals(prjMap.get("SinCd"))) {//체크인
			return gson.toJson(cmr0200.getReqList(prjMap));
			
		} else { //SinCd=03(테스트적용) or 04(운영적용) 
			return gson.toJson(cmr0200.getDeployList(prjMap));
		}
	}

	private String requestConf(JsonElement jsonElement) throws SQLException, Exception {
		
		ArrayList<HashMap<String, String>> secondGridData = new ArrayList<HashMap<String, String>>();
		secondGridData = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"secondGridData"));

		HashMap<String, String> requestData = new HashMap<String, String>();
		requestData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"requestData"));
		
		ArrayList<HashMap<String, Object>> requestConfirmData = new ArrayList<HashMap<String, Object>>();
		requestConfirmData = ParsingCommon.jsonStrToArrObj(ParsingCommon.jsonEtoStr(jsonElement,"requestConfirmData"));
		
		ArrayList<HashMap<String, String>> scriptData = new ArrayList<HashMap<String, String>>();
		scriptData = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"scriptData"));
		
		if ("07".equals(requestData.get("SinCd"))) {//체크인
			return gson.toJson(cmr0200.request_Check_In(secondGridData, requestData, requestConfirmData, "Y", scriptData ));
			
		} else { //SinCd=03(테스트적용) or 04(운영적용) 
			ArrayList<HashMap<String, String>> befJobData = new ArrayList<HashMap<String, String>>();
			befJobData = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"befJobData"));
			
			return gson.toJson(cmr0200.request_Deploy(secondGridData, requestData, befJobData, requestConfirmData, "Y", scriptData));
		}
			
	}
	private String getDownFileList(JsonElement jsonElement) throws SQLException, Exception {
		
		ArrayList<HashMap<String, String>> fileList = new ArrayList<HashMap<String, String>>();
		fileList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"fileList"));
		
		HashMap<String, String> etcData = new HashMap<String, String>();
		etcData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"downFileData"));

		if ("07".equals(etcData.get("SinCd"))) {//체크인
			return gson.toJson(cmr0200.getDownFileList(fileList,etcData));
			
		} else { //SinCd=03(테스트적용) or 04(운영적용) 
			return gson.toJson(cmr0200.getDownFileList_Deploy(fileList,etcData));
		}
			
	}
	private String confSelect(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> fileList = new ArrayList<HashMap<String, String>>();
		fileList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"fileList"));
		HashMap<String, String> etcData = new HashMap<String, String>();
		etcData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"downFileData"));
		return gson.toJson(cmr0200.getDownFileList(fileList,etcData));
			
	}
	
	private String Confirm_Info(JsonElement jsonElement) throws SQLException, Exception{
		
		return "";
	}
}
