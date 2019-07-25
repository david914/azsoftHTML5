package html.app.winpop;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmd.Cmd1400;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/winpop/PopScriptServlet")
public class PopScriptServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmd1400 cmd1400 = new Cmd1400();
	
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
				case "getProgInfo" :
					response.getWriter().write( getProgInfo(jsonElement) );
					break;
				case "getBldList" :
					response.getWriter().write( getBldList(jsonElement) );
					break;
				case "getBldScript" :
					response.getWriter().write( getBldScript(jsonElement) );
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

	private String getProgInfo(JsonElement jsonElement) throws SQLException, Exception {
		String ItemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ItemId") );
		
		return gson.toJson(cmd1400.getProgInfo(ItemId));
	}
	
	private String getBldList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String RsrcCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "RsrcCd") );
		String JobCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "JobCd") );
		String QryCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "QryCd") );
		String ItemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ItemId") );
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );

		return gson.toJson(cmd1400.getBldList(SysCd,RsrcCd,JobCd,QryCd,ItemId,AcptNo));
	}

	private String getBldScript(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String RsrcCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "RsrcCd") );
		String JobCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "JobCd") );
		String RsrcName = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "RsrcName") );
		String DirPath = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "DirPath") );
		String BldGbn = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "BldGbn") );
		String BldCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "BldCd") );
		String ItemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ItemId") );
		String PrcSys = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "PrcSys") );

		return gson.toJson(cmd1400.getBldScript(AcptNo,SysCd,RsrcCd,JobCd,RsrcName,DirPath,BldGbn,BldCd,ItemId,PrcSys));
	}
}
