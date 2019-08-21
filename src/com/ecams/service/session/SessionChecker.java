package com.ecams.service.session;

//import java.io.*;
//import java.util.*;
import javax.servlet.http.*;

public class SessionChecker{
    public void setSession(HttpSession session){
 // ������ ��ü�� �����ؼ� �̰͵� ���ǿ� ���� ��´�.  ������ ��� �̸�����...
        session.setAttribute("listener", new CustomBindingListener());
    }
}

//                                                     ���⼭    �����߽��ϴ�..

class CustomBindingListener implements HttpSessionBindingListener {
    public void valueBound(HttpSessionBindingEvent event) {
 // ������ ������ �� ����
        System.out.println("BOUND as " + event.getName() + " to " + event.getSession().getId());
    }

    public void valueUnbound(HttpSessionBindingEvent event) {
 // ������ ����Ǿ�����
        System.out.println("UNBOUND as " + event.getName() + " to " + event.getSession().getId());
    }
}
