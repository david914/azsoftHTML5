package html.app.administrator;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
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

import app.common.SysInfo;
import app.eCmd.Cmd1200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/BuildReleaseInfo")
public class BuildReleaseInfo extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmd1200 cmd1200 = new Cmd1200();
	SysInfo	sysInfo = new SysInfo();
	
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
				case "getBldCd" :
					response.getWriter().write(getBldCd(jsonElement));
					break;
				case "getScript" :
					response.getWriter().write(getScript(jsonElement));
					break;
				case "insertScript" :
					response.getWriter().write(insertScript(jsonElement));
					break;
				case "copyScript" :
					response.getWriter().write(copyScript(jsonElement));
					break;
				case "delScript" :
					response.getWriter().write(delScript(jsonElement));
					break;
				case "getExistScript" :
					response.getWriter().write(getExistScript(jsonElement));
					break;
				case "getSysInfo" :
					response.getWriter().write(getSysInfo(jsonElement));
					break;
				case "getQryCd" :
					response.getWriter().write(getQryCd(jsonElement));
					break;
				case "getBldList" :
					response.getWriter().write(getBldList(jsonElement));
					break;
				case "getJobInfo" :
					response.getWriter().write(getJobInfo(jsonElement));
					break;
				case "deleteBldList" :
					response.getWriter().write(deleteBldList(jsonElement));
					break;
				case "insertBldList" :
					response.getWriter().write(insertBldList(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	/**
	 *	����/���������� ���� ��� �޼ҵ� 
	 */
	// [����/����������] �������� cbo ��������
	private String getBldCd(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmd1200.getBldCd());
	}
	
	// [����/����������] �������� ���ý� ��ũ��Ʈ ��������
	private String getScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn_code = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn_code"));
		String Cbo_BldCd0_code = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldCd0_code"));
		return gson.toJson(cmd1200.getScript(Cbo_BldGbn_code, Cbo_BldCd0_code));
	}
	
	// [����/����������] ��ũ��Ʈ ����
	private String insertScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn"));
		String Cbo_BldCd0 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldCd0"));
		String Txt_Comp2 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Txt_Comp2"));
		String runType 		= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"runType"));
		ArrayList<HashMap<String, String>> Lv_File0_dp 	= ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"Lv_File0_dp"));
		return gson.toJson(cmd1200.getCmm0022_DBProc(Cbo_BldGbn, Cbo_BldCd0, Txt_Comp2, runType, Lv_File0_dp));
	}
	
	// [����/����������] ��ũ��Ʈ ���̸�����
	private String copyScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn"));
		String Cbo_BldCd0 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldCd0"));
		String Txt_Comp2 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Txt_Comp2"));
		String NewBld 		= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"NewBld"));
		return gson.toJson(cmd1200.getCmm0022_Copy(Cbo_BldGbn, Cbo_BldCd0, NewBld));
	}
	
	// [����/����������] ��ũ��Ʈ ���� ����
	private String delScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn"));
		String Cbo_BldCd0 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldCd0"));
		return gson.toJson(cmd1200.getCmm0022_Del(Cbo_BldGbn, Cbo_BldCd0));
	}
	
	// [����/����������] ��ũ��Ʈ ���� ����
	private String getExistScript(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_BldGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"Cbo_BldGbn"));
		String msg 			= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"msg"));
		return gson.toJson(cmd1200.getSql_Qry(Cbo_BldGbn, msg));
	}
	
	/**
	 *	����/���������� ���� ���� �޼ҵ� 
	 */
	// [����/����������] �ý������� cbo ��������
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String SecuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SecuYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		String CloseYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"CloseYn"));
		String ReqCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ReqCd"));
		return gson.toJson(sysInfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	
	// [����/����������] ��û����/���౸�� ��������
	private String getQryCd(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String TstSw 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"TstSw"));
		return gson.toJson(cmd1200.getQryCd(SysCd, TstSw));
	}
	
	// [����/����������] ������������Ʈ/���α׷����� ��������
	private String getBldList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String TstSw 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"TstSw"));
		String QryCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"QryCd"));
		String SysInfo 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysInfo"));
		return gson.toJson(cmd1200.getBldList(SysCd, TstSw, QryCd, SysInfo));
	}
	
	// [����/����������] �������� ��������
	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserID 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserID"));
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String SecuYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SecuYn"));
		String CloseYn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"CloseYn"));
		String SelMsg 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SelMsg"));
		String sortCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"sortCd"));
		return gson.toJson(sysInfo.getJobInfo(UserID, SysCd, SecuYn, CloseYn, SelMsg, sortCd));
	}
	
	// [����/����������] ����
	private String deleteBldList(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> delList 	= ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"delList"));
		return gson.toJson(cmd1200.getCmm0033_Del(delList));
	}
	
	// [����/����������] ���
	private String insertBldList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData 	= ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"etcData"));
		return gson.toJson(cmd1200.getCmm0033_DBProc(etcData));
	}
}
