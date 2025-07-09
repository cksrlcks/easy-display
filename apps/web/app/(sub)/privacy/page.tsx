import PageHeader from "@/components/PageHeader";

export default function page() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>개인정보 처리방침</PageHeader.Title>
        <PageHeader.Description>
          이 페이지는 <b>Easy Display</b>의 개인정보처리방침에 대한 내용을 담고 있습니다.
        </PageHeader.Description>
      </PageHeader>

      <div className="mb-10">
        <h3>개인정보 수집 및 이용</h3>
        <p>본 애플리케이션은 어떠한 개인정보도 수집하거나 저장하지 않습니다.</p>
        <p>
          사용자의 어떠한 정보도 외부로 전송되지 않으며, 위치, 카메라, 연락처 등 민감 정보에
          접근하지 않습니다.
        </p>
      </div>

      <p>문의: chanki.kim89@gmail.com</p>
    </>
  );
}
