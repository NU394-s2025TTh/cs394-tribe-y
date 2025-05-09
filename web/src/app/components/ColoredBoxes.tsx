import React from 'react';
// '../../public/assets/coel.jpg' 
interface TeamMember {
  name: string;
  email: string;
  picture: string;
}

const yellowTeamMembers: TeamMember[] = [
  { name: 'Coel Morcott', email: 'coelmorcott@u.northwestern.edu', picture: 'assets/coel.jpg' },
  { name: 'Connor Lai', email: 'sampleemail@u.northwestern.edu', picture: 'https://via.placeholder.com/150' },
  { name: 'Brenda Mutai', email: 'sampleemail@u.northwestern.edu', picture: 'https://via.placeholder.com/150' },
  { name: 'Ryan Luedtke', email: 'sampleemail@u.northwestern.edu', picture: 'https://via.placeholder.com/150' },
  { name: 'Haipeng Shen', email: 'haipengshen2026@u.northwestern.edu', picture: 'assets/Haipeng.JPG' }
];

const orangeTeamMembers: TeamMember[] = [
  { name: 'Anthony Chung', email: 'sampleemail@u.northwestern.edu', picture: 'https://via.placeholder.com/150' },
  { name: 'Anthony Milas', email: 'anthonymilas2026@u.northwestern.edu', picture: 'assets/AnthonyM.jpg' },
  { name: 'Desmond Nebah', email: 'desmondnebah2025@u.northwestern.edu', picture: 'assets/Desmond.jpg' },
  { name: 'Qanita Zahara', email: 'sampleemail@u.northwestern.edu', picture: 'https://via.placeholder.com/150' },
  { name: 'Ziad Elbadry', email: 'sampleemail@u.northwestern.edu', picture: 'https://via.placeholder.com/150' }
];

export const ColoredBoxes: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', justifyContent: 'center', width: '100%' }}>
      <div
        style={{
          width: '300px',
          height: '1500px',
          backgroundColor: 'yellow',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          fontSize: '24px',
          fontWeight: 'bold',
          border: '2px solid black',
          borderRadius: '8px'
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Yellow Team</h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          fontSize: '16px',
          width: '100%'
        }}>
          {yellowTeamMembers.map((member, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                padding: '10px',
                borderRadius: '4px',
                width: '100%'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{member.name}</div>
              <a 
                href={`mailto:${member.email}`}
                style={{ 
                  fontSize: '14px', 
                  color: 'inherit',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                {member.email}
              </a>
              <img src={member.picture} alt={member.name} style={{ width: '100%', height: 'auto', marginTop: '8px' }} />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          width: '300px',
          height: '1500px',
          backgroundColor: 'orange',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          fontSize: '24px',
          fontWeight: 'bold',
          border: '2px solid black',
          borderRadius: '8px'
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Orange Team</h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          fontSize: '16px',
          width: '100%'
        }}>
          {orangeTeamMembers.map((member, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                padding: '10px',
                borderRadius: '4px',
                width: '100%'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{member.name}</div>
              <a 
                href={`mailto:${member.email}`}
                style={{ 
                  fontSize: '14px', 
                  color: 'inherit',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                {member.email}
              </a>
              <img src={member.picture} alt={member.name} style={{ width: '100%', height: 'auto', marginTop: '8px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColoredBoxes; 