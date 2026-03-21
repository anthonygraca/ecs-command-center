import { Link } from "react-router-dom";

interface OrgCardDetails{
    id: number;
    name: string;
    acronym: string;
    description: string;
}

const OrgCard = ({ id, name, acronym, description }: OrgCardDetails) => {
    return (
    <Link to={`/orgs/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div>
            <h2>{name}</h2>
            <p>{acronym}</p>
            <p>{description}</p>
        </div>
    </Link>
);
};

export default OrgCard;