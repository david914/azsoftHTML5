/**
 * SysInfo �������� ���� ����
 * <pre>
 * <b>History</b>
 * 	�ۼ���: ������
 * 	���� : 1.0
 *  ������ : 2019-02-19
 */

package html.app.common;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.*;

import app.common.SysInfo;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/common/CommonSysInfo")
public class CommonSysInfo extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysInfo = new SysInfo();

	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String requestType = null;
		requestType = ParsingCommon.parsingRequestJsonParamToString(request, "requestType");
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "SYS_INFO" :
					response.getWriter().write( getSysInfo(request) );
					break;
				case "JOB_INFO" :
					response.getWriter().write( getJobInfo(request) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}//end of getSysInfo() method statement
	
	
	private String getSysInfo(HttpServletRequest request) throws SQLException, Exception {
		HashMap<String, String> getSysInfoMap = ParsingCommon.parsingRequestJsonParamToHashMap(request, "sysData");
		return gson.toJson( sysInfo.getSysInfo(
								getSysInfoMap.get("UserId"), 
								"", 
								getSysInfoMap.get("SelMsg"), 
								getSysInfoMap.get("CloseYn"), 
								getSysInfoMap.get("ReqCd")
							));
	}

	private String getJobInfo(HttpServletRequest request) throws SQLException, Exception {
		HashMap<String, String> getJobInfoMap = ParsingCommon.parsingRequestJsonParamToHashMap(request, "jobData");
		return gson.toJson( sysInfo.getJobInfo(
								getJobInfoMap.get("UserId"), 
								getJobInfoMap.get("SysCd"), 
								getJobInfoMap.get("SecuYn"), 
								getJobInfoMap.get("CloseYn"), 
								getJobInfoMap.get("SelMsg"),
								getJobInfoMap.get("sortCd")
							));
	}
	
	

}
