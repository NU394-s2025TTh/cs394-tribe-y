import React from 'react';
// '../../public/assets/coel.jpg'
interface TeamMember {
  name: string;
  email: string;
  picture: string;
}

const yellowTeamMembers: TeamMember[] = [
  {
    name: 'Coel Morcott',
    email: 'coelmorcott@u.northwestern.edu',
    picture: 'assets/coel.jpg',
  },
  {
    name: 'Connor Lai',
    email: 'connorlai2026@u.northwestern.edu',
    picture: 'assets/Connor Lai.jpg',
  },
  {
    name: 'Brenda Mutai',
    email: 'brendamutai2026@u.northwestern.edu',
    picture: 'assets/brenda.jpg',
  },
  {
    name: 'Ryan Luedtke',
    email: 'ryanluedtke2026@u.northwestern.edu',
    picture: 'assets/ryan.jpg',
  },
  {
    name: 'Haipeng Shen',
    email: 'haipengshen2026@u.northwestern.edu',
    picture: 'assets/Haipeng.JPG',
  },
];

const orangeTeamMembers: TeamMember[] = [
  {
    name: 'Anthony Chung',
    email: 'anthonychung2027@u.northwestern.edu',
    picture: 'assets/AnthonyC.png',
  },
  {
    name: 'Anthony Milas',
    email: 'anthonymilas2026@u.northwestern.edu',
    picture: 'assets/AnthonyM.jpg',
  },
  {
    name: 'Desmond Nebah',
    email: 'desmondnebah2025@u.northwestern.edu',
    picture: 'assets/Desmond.jpg',
  },
  {
    name: 'Qanita Zahara',
    email: 'qanitazahara2025@u.northwestern.edu',
    picture: 'assets/Qanita.jpg',
  },
  {
    name: 'Ziad Elbadry',
    email: 'ziadelbadryshaker2025@u.northwestern.edu',
    picture: 'assets/ZiadEl.jpg',
  },
];

export const ColoredBoxes: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '300px',
          height: '100%',
          backgroundColor: 'yellow',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          fontSize: '24px',
          fontWeight: 'bold',
          border: '2px solid black',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Yellow Team</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '16px',
            width: '100%',
          }}
        >
          {yellowTeamMembers.map((member, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(216, 234, 19, 0.91)',
                padding: '10px',
                borderRadius: '4px',
              }}
            >
              <img
                src={member.picture}
                alt={member.name}
                style={{
                  width: '100px',
                  height: '120px',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontWeight: 'bold' }}>{member.name}</div>
              <a
                href={`mailto:${member.email}`}
                style={{
                  fontSize: '14px',
                  color: 'blue',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                {member.email}
              </a>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          width: '300px',
          height: '100%',
          backgroundColor: 'orange',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          fontSize: '24px',
          fontWeight: 'bold',
          border: '2px solid black',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Orange Team</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '16px',
            width: '100%',
          }}
        >
          {orangeTeamMembers.map((member, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                padding: '10px',
                borderRadius: '4px',
              }}
            >
              <img
                src={member.picture}
                alt={member.name}
                style={{
                  width: '100px',
                  height: '120px',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontWeight: 'bold' }}>{member.name}</div>
              <a
                href={`mailto:${member.email}`}
                style={{
                  fontSize: '14px',
                  color: 'blue',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                {member.email}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColoredBoxes;
