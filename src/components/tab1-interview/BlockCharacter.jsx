/**
 * 이미지 파일 없이 만드는 블록형 3D 캐릭터.
 * 몸의 각 면을 CSS로 그려서 저사양 학교 태블릿에서도 가볍게 동작한다.
 */
export default function BlockCharacter({ palette, npc = false, walking = false }) {
  const colors = {
    skin: palette?.skin || '#f4b98a',
    hair: palette?.hair || '#3b2b25',
    shirt: palette?.shirt || '#f5c542',
    pants: palette?.pants || '#38527c',
    accent: palette?.accent || '#ffffff',
  };

  return (
    <span
      className={`block-person ${npc ? 'block-person--npc' : 'block-person--player'} ${
        walking ? 'block-person--walking' : ''
      }`}
      style={{
        '--skin': colors.skin,
        '--hair': colors.hair,
        '--shirt': colors.shirt,
        '--pants': colors.pants,
        '--accent': colors.accent,
      }}
      aria-hidden="true"
    >
      <span className="block-person__shadow" />
      <span className="block-person__leg block-person__leg--left" />
      <span className="block-person__leg block-person__leg--right" />
      <span className="block-person__body">
        <span className="block-person__badge" />
      </span>
      <span className="block-person__arm block-person__arm--left" />
      <span className="block-person__arm block-person__arm--right" />
      <span className="block-person__head">
        <span className="block-person__hair" />
        <span className="block-person__eye block-person__eye--left" />
        <span className="block-person__eye block-person__eye--right" />
      </span>
    </span>
  );
}
