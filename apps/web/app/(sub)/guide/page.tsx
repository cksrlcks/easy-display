import GuideImage from "@/assets/img/guide.svg";
import Section from "@/components/Section";
import { TabButton, TabContent, TabList, Tabs } from "@/components/Tabs";
import Image from "next/image";

export default function GuidePage() {
  return (
    <>
      <div>
        <h2>이용가이드</h2>
        <p>
          Easy Display는 호스트 앱과 클라이언트 앱으로 구성되어, 디스플레이 콘텐츠를 손쉽게 관리하고
          송출할 수 있도록 돕는 솔루션입니다.
        </p>
      </div>

      <div className="my-10">
        <Image src={GuideImage} alt="easy-display" />
      </div>

      <div>
        <Tabs defaultValue="host">
          <TabList>
            <TabButton value="host">
              HOST <br className="block md:hidden" /> (PC or Mac)
            </TabButton>
            <TabButton value="client">
              Client <br className="block md:hidden" /> (Android TV App)
            </TabButton>
          </TabList>
          <TabContent value="host">
            <Section>
              <Section.Paragraph>
                호스트 앱은 콘텐츠 관리 및 디스플레이 제어를 위한 핵심 프로그램입니다.
              </Section.Paragraph>
            </Section>
            <Section>
              <Section.Title>설치방법</Section.Title>
              <Section.OrderedList>
                <Section.OrderedListItem>
                  다운로드 링크에서 운영체제(Windows용 .exe, macOS용 .dmg) 에 맞는 설치 파일을
                  다운로드하여 설치합니다.
                </Section.OrderedListItem>
                <Section.OrderedListItem>설치 후 앱을 실행하면 됩니다.</Section.OrderedListItem>
              </Section.OrderedList>
              <Section.List>
                <Section.ListItem>
                  Windows: <b>SmartScreen</b> 경고가 나타날 수 있습니다.
                </Section.ListItem>
                <Section.ListItem>
                  macOS: <b>확인되지 않은 개발자</b> 경고가 나타날 수 있습니다.
                </Section.ListItem>
              </Section.List>
            </Section>
            <Section>
              <Section.Title>주요 메뉴 기능</Section.Title>
              <Section.SubSection>
                <Section.SubTitle>미디어 관리</Section.SubTitle>
                <Section.Paragraph>
                  디스플레이에 사용할 이미지, 비디오 등 다양한 미디어 파일을 관리하는 공간입니다.
                </Section.Paragraph>
                <Section.List>
                  <Section.ListItem>더블 클릭: 파일을 미리 볼 수 있습니다.</Section.ListItem>
                  <Section.ListItem>
                    오른쪽 클릭: 상세 정보 확인 및 파일 삭제가 가능합니다.
                  </Section.ListItem>
                </Section.List>
              </Section.SubSection>
              <Section.SubSection>
                <Section.SubTitle>스크린 관리</Section.SubTitle>
                <Section.Paragraph>
                  디스플레이에 송출할 콘텐츠 묶음인 스크린을 생성하고 관리합니다.
                </Section.Paragraph>
                <Section.List>
                  <Section.ListItem>
                    다양한 상황에 맞춰 여러 개의 스크린을 미리 만들어둘 수 있습니다.
                  </Section.ListItem>
                  <Section.ListItem>
                    스크린 생성 후에는 슬라이드 관리 페이지로 이동하여, 미디어 관리에서 추가한
                    파일들을 슬라이드로 구성할 수 있습니다.
                  </Section.ListItem>
                  <Section.ListItem>
                    각 슬라이드의 방향 회전, 노출 시간 등을 세밀하게 설정할 수 있습니다.
                  </Section.ListItem>
                </Section.List>
              </Section.SubSection>
              <Section.SubSection>
                <Section.SubTitle>디스플레이 관리</Section.SubTitle>
                <Section.Paragraph>
                  로컬 네트워크 상에서 Easy Display 클라이언트 앱을 실행 중인 장치들을 검색합니다.
                </Section.Paragraph>
                <Section.List>
                  <Section.ListItem>
                    검색된 장치를 확인하고, 등록 버튼을 통해 호스트에 디스플레이로 등록할 수
                    있습니다.
                  </Section.ListItem>
                </Section.List>
              </Section.SubSection>
              <Section.SubSection>
                <Section.SubTitle>연결관리</Section.SubTitle>
                <Section.Paragraph>
                  미리 생성해 둔 스크린과 등록된 디스플레이(장치)를 서로 연결합니다.
                </Section.Paragraph>
                <Section.List>
                  <Section.ListItem>
                    새롭게 등록된 디스플레이는 기본적으로 &apos;없음&apos; 상태이며, 원하는 스크린을
                    직접 할당해야 콘텐츠가 송출됩니다.
                  </Section.ListItem>
                </Section.List>
              </Section.SubSection>
            </Section>
          </TabContent>
          <TabContent value="client">
            <Section>
              <Section.Paragraph>
                클라이언트 앱은 호스트 앱에서 송출하는 콘텐츠를 받아 디스플레이하는 역할을 합니다.
              </Section.Paragraph>
            </Section>
            <Section>
              <Section.Title>설치방법</Section.Title>
              <Section.OrderedList>
                <Section.OrderedListItem>
                  다운로드 링크에서 .apk 파일을 직접 다운로드하여 설치하거나, Google Play 스토어에서
                  <b> Easy Display</b>를 검색하여 다운로드 받을 수 있습니다.
                </Section.OrderedListItem>
              </Section.OrderedList>
              <Section.List>
                <Section.ListItem>현재 Play 스토어 출시를 준비 중입니다.</Section.ListItem>
              </Section.List>
            </Section>
            <Section>
              <Section.Title>사용 방법</Section.Title>
              <Section.OrderedList>
                <Section.ListItem>
                  앱을 실행하면, 로컬 네트워크 내에서 Easy Display 호스트를 자동으로 검색합니다.
                </Section.ListItem>
                <Section.ListItem>
                  검색된 호스트 목록에서 연결하고자 하는 호스트를 선택합니다.
                </Section.ListItem>
                <Section.ListItem>
                  호스트에 성공적으로 연결되면 슬라이드 화면으로 전환됩니다.
                </Section.ListItem>
              </Section.OrderedList>
              <Section.List>
                <Section.ListItem>
                  호스트 프로그램에서 해당 장치에 스크린이 할당되어 있어야만 슬라이드가 정상적으로
                  재생됩니다.
                </Section.ListItem>
              </Section.List>
            </Section>
          </TabContent>
        </Tabs>
      </div>
    </>
  );
}
