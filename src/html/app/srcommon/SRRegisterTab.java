/**
 * PrjListTab ȭ�� ����
 * <pre>
 * <b>History</b>
 * 	�ۼ���: �̿빮
 * 	���� : 1.0
 *  ������ : 2019-02-07
 */

package html.app.srcommon;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.*;

import app.common.CodeInfo;
import app.common.PrjInfo;
import app.common.TeamInfo;
import app.eCmc.Cmc0100;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/srcommon/SRRegisterTab")
public class SRRegisterTab extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmc0100 cmc0100 = new Cmc0100();
	
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
				case "GET_USER_COMBO" :
					response.getWriter().write( getUserCombo(jsonElement) );
					break;
				case "selectSRInfo" :
					response.getWriter().write( selectSRInfo(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getUserCombo(JsonElement jsonElement) throws SQLException, Exception {
		String userId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userInfoData") );
		return gson.toJson(cmc0100.getUserCombo("REQUSER", "", "", userId));
	}
	
	private String selectSRInfo(JsonElement jsonElement) throws SQLException, Exception {
		String srid = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "srInfoData") );
		return gson.toJson(cmc0100.selectSRInfo(srid));
	}
	
}
