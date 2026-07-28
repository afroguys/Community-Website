import { useState, useEffect } from 'react';
import { getRules } from '../../../http';
import Styles from "./SocietyRules.module.css";
import RulesCard from "./RulesCard/RulesCard";

const SocietyRules = () => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await getRules();
      setRules(data.rules || []);
    }
    load();
  }, []);

  if (rules.length === 0) return null;

  return (
    <div className={Styles.rulesWrapper}>
      <div className="container container-margin-top">
        <h1 className="heading" data-aos="zoom-in">Peraturan Taman</h1>
        <div className={Styles.rulesWrapper}>
          {rules.map((r, i) => (
            <RulesCard key={r._id} dataAos="fade-up" rulesName={r.title} discription={r.description} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocietyRules;
