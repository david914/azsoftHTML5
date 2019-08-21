package html.app.report;

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

import app.eCmp.Cmp2700;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/FileChkReport")
public class FileChkReport extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmp2700 cmp2700 = new Cmp2700();
	
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
				case "getDaesa" :
					response.getWriter().write( getDaesa(jsonElement) );
					break;
				case "getDaesaDetail" :
					response.getWriter().write( getDaesaDetail(jsonElement) );
					break;
				case "getDaesaResult" :
					response.getWriter().write( getDaesaResult(jsonElement) );
					break;
				case "getResult" :
					response.getWriter().write( getResult(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [���ϴ������ȸ > �������ȸ] ����� ����Ʈ ��������
	private String getDaesa(JsonElement jsonElement) throws SQLException, Exception {
		String datStD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"datStD"));
		String datEdD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"datEdD"));
		return gson.toJson(cmp2700.getDaesa(datStD, datEdD));
	}
	// [���ϴ������ȸ > �������ȸ] ����� ����Ʈ ��������(detail)
	private String getDaesaDetail(JsonElement jsonElement) throws SQLException, Exception {
		String datStD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"datStD"));
		String datEdD 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"datEdD"));
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		return gson.toJson(cmp2700.getDaesa2(UserId, datStD, datEdD));
	}
	// [���ϴ������ȸ > �������ȸ > ��系���հ�ǥ] ��系���հ�ǥ ����Ʈ ��������
	private String getDaesaResult(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String diffdt 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"diffdt"));
		String diffseq 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"diffseq"));
		String svrip 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"svrip"));
		String detail 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"detail"));
		String portNo 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"portNo"));
		return gson.toJson(cmp2700.DaesaResult(UserId, diffdt, diffseq, svrip, detail, portNo));
	}
	// [���ϴ������ȸ ] ����� ��ȸ ����Ʈ ��������
	private String getResult(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"UserId"));
		String diffdt 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"diffdt"));
		String diffSeq 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"diffSeq"));
		String svrIp 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"svrIp"));
		String SysCd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"SysCd"));
		String diffRst 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"diffRst"));
		String portNo 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"portNo"));
		return gson.toJson(cmp2700.getResult(UserId, diffdt, diffSeq, svrIp, SysCd, diffRst, portNo));
	}
}
