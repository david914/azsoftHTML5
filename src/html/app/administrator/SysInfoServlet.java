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

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.CodeInfo;
import app.common.SysInfo;
import app.eCmm.Cmm0200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/SysInfoServlet")
public class SysInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysInfo = new SysInfo();
	CodeInfo codeInfo = new CodeInfo();
	Cmm0200 cmm0200 = new Cmm0200(); 
	
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
				case "getSysInfoCbo" :
					response.getWriter().write(getSysInfoCbo(jsonElement));
					break;
				case "getJobList" :
					response.getWriter().write(getJobList(jsonElement));
					break;
				case "getJobInfo" :
					response.getWriter().write(getJobInfo(jsonElement));
					break;
				case "getSysInfoList" :
					response.getWriter().write(getSysInfoList(jsonElement));
					break;
				case "factUp" :
					response.getWriter().write(updateFactUp(jsonElement));
					break;
				case "closeSys" :
					response.getWriter().write(closeSystem(jsonElement));
					break;
				case "updateSystem" :
					response.getWriter().write(udpateSystem(jsonElement));
					break;
				case "getProcType" :
					response.getWriter().write(getProcType(jsonElement));
					break;
				case "getUseSysCdList" :
					response.getWriter().write(getUseSysCdList(jsonElement));
					break;
				case "TEST" :
					response.getWriter().write(testMethod(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	// [�ý�������] �ý��� �޺� ���� ��������
	private String getSysInfoCbo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> sysInfoCbo = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"sysInfoCbo"));
		return gson.toJson(sysInfo.getSysInfo_Rpt(sysInfoCbo));
	}
	// [�ý�������] ���� ����Ʈ ��������
	private String getJobList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> jobInfoCbo = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"jobInfoCbo"));
		return gson.toJson(codeInfo.getJobCd(jobInfoCbo.get("SelMsg"), jobInfoCbo.get("closeYn")));
	}
	// [�ý�������] ��밡���� �ý����ڵ� ��������
	private String getUseSysCdList(JsonElement jsonElement) throws SQLException, Exception {
		//HashMap<String, String> sysInfoCbo = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"useSysLIstCbo"));
		return gson.toJson(cmm0200.getUseSysCdList());
	}
	// [�ý�������] �������� ��������
	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> sysJobInfo = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"sysJobInfo"));
		return gson.toJson(sysInfo.getJobInfo(sysJobInfo.get("UserID")
												, sysJobInfo.get("SysCd")
												, sysJobInfo.get("SecuYn")
												, sysJobInfo.get("CloseYn")
												, sysJobInfo.get("SelMsg")
												, sysJobInfo.get("sortCd"))	);
	}
	// [�ý�������] �ý��� ����Ʈ ��������
	private String getSysInfoList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> sysInfo = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"sysInfo"));
		return gson.toJson(cmm0200.getSysInfo_List(Boolean.valueOf(sysInfo.get("clsSw")), sysInfo.get("SysCd")) );
	}
	// [�ý�������] �ý��� ��
	private String closeSystem(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> sysInfo = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"sysInfo"));
		return gson.toJson(cmm0200.sysInfo_Close(sysInfo.get("SysCd"), sysInfo.get("UserId")));
	}
	// [�ý�������] ó�������߰�
	private String updateFactUp(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(	cmm0200.factUpdt() );
	}
	// [�ý�������] �ý��� ����/���
	private String udpateSystem(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> systemInfo = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"systemInfo"));
		return gson.toJson(	cmm0200.sysInfo_Updt(systemInfo) );
	}
	
	// [�ý�������] ���μ��� ���� ��������
	private String getProcType(JsonElement jsonElement) throws SQLException, Exception {
		String syscd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"syscd"));
		return gson.toJson(	cmm0200.process_Gb(syscd) );
	}
	
	// TEST METHOD�Դϴ�.
	private String testMethod(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, Object>> testList = ParsingCommon.jsonStrToArrObj(ParsingCommon.jsonEtoStr(jsonElement,"testList"));
		HashMap<String, String> testMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"sysJobInfo"));
		System.out.println("=========check===============");
		System.out.println(testList);
		System.out.println(testMap);
		return gson.toJson(	null );
	}
	
}
