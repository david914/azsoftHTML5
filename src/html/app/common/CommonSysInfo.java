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
		JsonParser jsonParser = new JsonParser();
		JsonElement jsonElement = jsonParser.parse(ParsingCommon.getJsonStr(request));
		String requestType	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "requestType") );
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "SYS_INFO" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "JOB_INFO" :
					response.getWriter().write( getJobInfo(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}//end of getSysInfo() method statement
	
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "Data") );
		return gson.toJson( sysInfo.getSysInfo(
								DataMap.get("UserId"), 
								"", 
								DataMap.get("SelMsg"), 
								DataMap.get("CloseYn"), 
								DataMap.get("ReqCd")
							));
	}

	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "Data") );
		return gson.toJson( sysInfo.getJobInfo(
								DataMap.get("UserId"), 
								DataMap.get("SysCd"), 
								DataMap.get("SecuYn"), 
								DataMap.get("CloseYn"), 
								DataMap.get("SelMsg"),
								DataMap.get("sortCd")
							));
	}
	
	

}
